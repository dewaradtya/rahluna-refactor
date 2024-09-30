<?php

namespace App\Http\Controllers;

use App\Models\DebtInvoice;
use App\Models\Entertaint;
use App\Models\Invoice;
use App\Models\ManageCapital;
use App\Models\ManageDebt;
use App\Models\ManageReceivable;
use App\Models\Oprasional;
use App\Models\ProductHistory;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $currentDate = Carbon::now();
        $currentMonth = $currentDate->month;
        $currentYear = $currentDate->year;

        $totalInvoiceTerbayar = $this->sumInvoices($currentMonth, $currentYear);
        $modal = $this->sumManageCapital();
        $totalPenjualan = $this->sumProductHistory('stok terpakai', $currentMonth, $currentYear);
        $totalPenjualanInv = $this->sumInvoicesWithDetails($currentMonth, $currentYear);
        $hutang = $this->sumManageDebt();

        $uang_masuk = $totalInvoiceTerbayar + $modal + $totalPenjualan + $totalPenjualanInv + $hutang;
        $uang_keluar = $this->calculateUangKeluar($currentMonth, $currentYear);

        $totalCashflow = $uang_masuk - $uang_keluar;

        $penjualanPerBulan = [];
        $pengeluaranPerBulan = [];
        $profitPerBulan = [];

        for ($month = 1; $month <= 12; $month++) {
            $penjualan = $this->sumProductHistory('stok terpakai', $month, $currentYear);
            $penjualanInv = $this->sumInvoiceSales($month, $currentYear);

            $pengeluaran = $this->calculateUangKeluar($month, $currentYear);

            $profit = $penjualan + $penjualanInv - $pengeluaran;

            $penjualanPerBulan[] = $penjualan + $penjualanInv;
            $pengeluaranPerBulan[] = $pengeluaran;
            $profitPerBulan[] = $profit;
        }

        $chartData = [
            'penjualan' => $penjualanPerBulan,
            'pengeluaran' => $pengeluaranPerBulan,
            'profit' => $profitPerBulan,
        ];

        return Inertia::render('Dashboard/Index', [
            'totalCashflow' => $totalCashflow,
            'chartData' => $chartData,
            'totalPembelianProdukBulan' => $this->sumProductHistory(['stok awal', 'tambah stok'], $currentMonth, $currentYear),
            'totalPembelianProdukTahun' => $this->sumProductHistory(['stok awal', 'tambah stok'], null, $currentYear),
            'totalPenjualanProdukBulan' => $this->sumProductHistory('stok terpakai', $currentMonth, $currentYear),
            'totalPenjualanProdukTahun' => $this->sumProductHistory('stok terpakai', null, $currentYear),
            'totalOperasionalBulan' => $this->sumOprasional(['Oprasional', 'Gaji', 'Fee', 'Bayar Pajak'], $currentMonth, $currentYear),
            'totalOperasionalTahun' => $this->sumOprasional(['Oprasional', 'Gaji', 'Fee', 'Bayar Pajak'], null, $currentYear),
            'totalInvHutang' => $this->sumDebtInvoice(false, $currentMonth, $currentYear),
            'totalInvHutangOvertime' => $this->sumDebtInvoice(true, null, $currentYear),
            'totalInvJualBulan' => $this->sumInvoiceSales($currentMonth, $currentYear),
            'totalInvJualTahun' => $this->sumInvoiceSales(null, $currentYear),
            'totalEntertaintCost' => $this->sumEntertaint(),
            'totalHutang' => $this->sumManageDebt(),
        ]);
    }

    private function sumInvoices($month, $year)
    {
        return Invoice::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->sum('total_bayar');
    }

    private function sumOprasional($funding, $month = null, $year = null)
    {
        return Oprasional::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->whereIn('funding', (array) $funding)
            ->sum('amount');
    }

    private function sumProductHistory($status, $month = null, $year = null)
    {
        return ProductHistory::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->whereIn('status', (array) $status)
            ->sum(DB::raw('(CASE WHEN status IN ("stok awal", "tambah stok") THEN purchase_price ELSE price END) * qty'));
    }


    private function sumPiutang($month = null, $year = null)
    {
        return ManageReceivable::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->sum(DB::raw('amount - total_payment'));
    }

    private function sumInvoicesWithDetails($month, $year)
    {
        return Invoice::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->get()
            ->sum(fn($invoice) => $invoice->total_invoice - $invoice->total_bayar + $invoice->nilai_ppn);
    }

    private function calculateUangKeluar($month, $year)
    {
        return $this->sumOprasional(['Oprasional', 'Gaji', 'Fee', 'Bayar Pajak'], $month, $year)
            + $this->sumProductHistory(['stok awal', 'tambah stok'], $month, $year)
            + $this->sumPiutang();
    }

    private function sumDebtInvoice($isOvertime, $month = null, $year = null)
    {
        return DebtInvoice::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->where('cashflow', 1)
            ->where('amount', '>', 0)
            ->where('date', $isOvertime ? '<' : '>=', Carbon::now()->toDateString())
            ->sum(DB::raw('amount - total_payment'));
    }

    private function sumManageDebt()
    {
        return ManageDebt::where('cashflow', 1)
            ->sum(DB::raw('amount + interest_amount - total_payment'));
    }

    private function sumManageCapital()
    {
        return ManageCapital::where('cashflow', 1)
            ->sum('amount');
    }

    private function sumEntertaint()
    {
        return Entertaint::sum('amount');
    }

    private function sumInvoiceSales($month = null, $year = null)
    {
        return Invoice::when($month, fn($query) => $query->whereMonth('first_create', $month))
            ->when($year, fn($query) => $query->whereYear('first_create', $year))
            ->get()
            ->sum(fn($invoice) => $invoice->total_invoice + $invoice->nilai_ppn);
    }
}

<?php

namespace App\Exports;

use App\Models\Project;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ProjectExport implements FromCollection, WithHeadings, WithStyles, ShouldAutoSize
{
    public function collection()
    {
        return Project::where('status', 'berlangsung')->get()->map(function ($project) {
            $totalMaterial = $project->total_material ?? 0;
            $totalPekerja = $project->total_pekerja ?? 0;
            $totalOprasional = $project->total_oprasional ?? 0;
            $totalSewaAlat = $project->total_sewa_alat ?? 0;
            $totalKonsumsi = $project->total_konsumsi ?? 0;
            $totalTransport = $project->total_transport ?? 0;
            $totalAset = $project->total_aset ?? 0;
            $totalUangMasuk = $project->total_uang_masuk ?? 0;
            $nilaiPenawaran = $project->nilai_penawaran ?? 0;
        
            $totalRequirements = $totalMaterial + $totalPekerja + $totalOprasional + $totalSewaAlat + $totalKonsumsi + $totalTransport + $totalAset;
        
            $profit = $nilaiPenawaran - $totalRequirements;
            $percentage = $nilaiPenawaran ? ($profit / $nilaiPenawaran) * 100 : 0;
        
            $deadline = \Carbon\Carbon::parse($project->deadline)->format('Y-m-d');
        
            return [
                'customer' => $project->customer->name ?? 'N/A',
                'name' => $project->name,
                'nilai_po' => $nilaiPenawaran,
                'total_material_pajak' => $totalMaterial,
                'total_material_non_pajak' => $totalMaterial,
                'total_pekerja' => $totalPekerja,
                'total_oprasional' => $totalOprasional,
                'total_sewa_alat' => $totalSewaAlat,
                'total_konsumsi' => $totalKonsumsi,
                'total_transport' => $totalTransport,
                'total_aset' => $totalAset,
                'profit_value' => $profit,
                'profit_percentage' => number_format($percentage, 2) . '%',
                'hutang' => $nilaiPenawaran - $totalUangMasuk,
                'deadline' => $deadline,
                'status' => $this->getStatus($project),
            ];
        });
    }

    public function headings(): array
    {
        return [
            'User',
            'Nama Project',
            'Nilai P.O',
            'Material Pajak',
            'Material Non-Pajak',
            'Pekerja',
            'Oprasional',
            'Sewa Alat',
            'Konsumsi',
            'Transport',
            'Aset',
            'Potensi Profit (Nilai)',
            'Potensi Profit (%)',
            'Hutang',
            'Deadline',
            'Status'
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => ['font' => ['bold' => true, 'size' => 12]],

            'A1:P1' => ['fill' => ['fillType' => 'solid', 'startColor' => ['argb' => 'FFD700']]],

            'A1:P' . $sheet->getHighestRow() => [
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN
                    ]
                ]
            ]
        ];
    }

    private function getStatus($project)
    {
        $status = $project->status;
        if (now() > $project->deadline) {
            return 'Over Time';
        } elseif ($status === 'selesai') {
            return 'Selesai';
        } elseif ($status === 'berlangsung') {
            return 'Process';
        } else {
            return 'Unknown';
        }
    }
}

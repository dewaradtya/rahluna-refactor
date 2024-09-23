<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kwitansi</title>
    <style>
        body {
            font-family: 'Courier New', Courier, monospace;
            margin: 0;
            padding: 20px;
            font-size: 12px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        td {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
        }

        th {
            border: 1px solid black;
            padding: 5px;
            text-align: center;
        }

        .company-info img {
            width: 90%;
        }

        .footer {
            display: table;
            width: 100%;
        }

        .footer-column {
            display: table-cell;
            width: 27.5%;
            vertical-align: top;
            text-align: center;
        }

        .footer-column-center {
            display: table-cell;
            width: 45%;
            vertical-align: top;
            text-align: center;
        }

        .notice {
            border: 1px solid black;
            padding: 5px;
            text-align: left;
            margin-top: 20px;
        }

        .notice h4 {
            margin: 0 0 5px 0;
        }

        .notice ol {
            margin: 0;
            padding-left: 20px;
        }
    </style>
</head>

<body>
    <table>
        <thead>
            <tr>
                <td colspan="4" style="border: 1px solid black;">
                    <div class="company-info">
                        <img src="{{ public_path('/img/kop-atas-pdf.png') }}" alt="kop-atas-pdf" />
                    </div>
                </td>
                <td colspan="3" style="border: 1px solid black;">
                    <p>Waru, {{ \Carbon\Carbon::parse($invoice->tanggal_dibuat)->format('d F Y') }}</p>
                    <p>Kepada Yth.</p>
                    <p>{{ $invoice->customer->name }}</p>
                </td>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td colspan="3" style="text-align: left;">No Faktur : {{ $invoice->kwitansi }}</td>
                <td colspan="4"></td>
            </tr>
            @php
                $subtotal = 0;
                $totalQty = 0;
                $ppn = $invoice->ppn;
                $nilai_ppn = $invoice->nilai_ppn;
                $pengurang_harga = $invoice->pengurang_harga ?? 0;
                $discount = $invoice->discount ?? 0;
                $nilai_discount = ($subtotal * $discount) / 100;
            @endphp
            <tr>
                <th style="width: 5%;">No.</th>
                <th colspan="2" style="width: 30%;">Nama Barang</th>
                <th style="width: 10%;">Pcs</th>
                <th style="width: 10%;">Yard</th>
                <th style="width: 15%;">Harga</th>
                <th style="width: 15%;">Subtotal</th>
            </tr>
            @forelse ($invoiceDetail as $row)
                @php
                    $total = $row->price * $row->qty;
                    $subtotal += $total;
                    $totalQty += $row->qty;
                @endphp
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td colspan="2">{{ $row->product->name }}</td>
                    <td>{{ $row->qty }}</td>
                    <td>{{ $row->qty }}</td>
                    <td>{{ 'Rp. ' . number_format($row->price, 0, ',', '.') }}</td>
                    <td>{{ 'Rp. ' . number_format($total, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Data Kosong</td>
                </tr>
            @endforelse
            <tr>
                <td colspan="1"></td>
                <td colspan="2">{{ $row->qty }}x{{ $row->qty }}</td>
                <td colspan="4"></td>
            </tr>
            <tr>
                <td colspan="3" style="text-align: center;">Total</td>
                <td>{{ $totalQty }}</td>
                <td>{{ $totalQty }}</td>
                <td></td>
                <td>{{ 'Rp. ' . number_format($subtotal, 0, ',', '.') }}</td>
            </tr>
            <tr>
                <td colspan="7" style="height: 14px;"></td>
            </tr>
            <tr>
                <td colspan="7">
                    <div class="footer">
                        <div class="footer-column">
                            <h4>Hormat Kami</h4>
                            <br><br>
                            <h4>_________________</h4>
                        </div>
                        <div class="footer-column-center">
                            <div class="notice">
                                <h4>Perhatian!!!</h4>
                                <ol>
                                    <li>Barang diterima dengan baik dan sesuai dengan pembelian</li>
                                    <li>Kehilangan / kerusakan diluar Toko, bukan tanggung jawab kami</li>
                                    <li>Barang yang sudah dibeli tidak boleh dikembalikan.</li>
                                </ol>
                            </div>
                        </div>
                        <div class="footer-column">
                            <h4>Penerima</h4>
                            <br><br>
                            <h4>_________________</h4>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>

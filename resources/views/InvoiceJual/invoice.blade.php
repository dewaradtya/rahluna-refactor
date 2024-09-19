<!DOCTYPE html>
<html>

<head>
    <title>Invoice</title>
    <style>
        body {
            font-size: 12px;
        }

        .container {
            max-width: 800px;
            margin: 0 auto;
        }

        .custom-table {
            width: 100%;
            border-collapse: collapse;
            border: 1px solid #000000;
            margin-bottom: 5px;
        }

        .custom-table th,
        .custom-table td {
            border: 1px solid #000000;
            padding: 8px;
            text-align: left;
        }

        .custom-table .head-table {
            background-color: rgb(217, 215, 215);
            color: #000000;
        }

        h6 {
            margin-bottom: 0px;
            font-size: 14px;
        }

        .w-full {
            width: 100%;
        }

        .w-half {
            width: 30%;
        }

        .w-center {
            width: 70%;
        }

        .left {
            width: 80%;
        }

        .right {
            width: 30%;
        }

        .margin-top {
            margin-top: 1.25rem;
        }

        .footer {
            font-size: 0.875rem;
            padding: 1rem;
            background-color: rgb(241 245 249);
        }

        .custom-table th {
            padding: 8px;
            text-align: center;
        }

        .custom-table td {
            background-color: #ffffff;
            padding: 8px;
        }

        .custom-table .total {
            font-weight: bold;
            text-align: right;
            background-color: rgb(241, 245, 249);
        }

        .product-note {
            font-style: italic;
            color: #555;
            font-size: 10px;
        }
    </style>
</head>

<body>
    <table class="w-full mb-4">
        <tr>
            <td class="w-center">
                <img src="{{ public_path('/img/kop-atas-pdf.png') }}" alt="kop-atas-pdf" style="width: 90%" />
            </td>
            <td class="w-half">
                <div><span style="margin-right:28px;">Invoice No </span> : {{ $invoice->referensi }}</div>
                <div><span style="margin-right:56px;">Page </span> : 1/1</div>
                <div><span style="margin-right:58px;">Date </span> :
                    {{ \Carbon\Carbon::parse($invoice->date)->format('d F Y') }}</div>
            </td>
        </tr>
    </table>

    <h1 style="margin-left:40%; margin-top: 30px; margin-bottom:-30px;">INVOICE</h1>
    <div class="">
        <table class="w-full">
            <tr>
                <td class="left">
                    <div>
                        <h6>Customer :</h6>
                    </div>
                    <div style="text-decoration: underline;">{{ $invoice->customer->name }}</div>
                    <div>{{ $invoice->customer->address }}</div>
                </td>
                <td class="right">
                    <div>
                        <h6>Nama Invoice :</h6>
                    </div>
                    <div>{{ $invoice->nama_invoice }}</div>
                </td>
            </tr>
        </table>
    </div>
    <div class="margin-top" style="margin-bottom: 40px;">
        <table class="w-full">
            <tr>
                <td class="left">
                    <div>
                        <h6>Due Date Payment :</h6>
                    </div>
                    <div>{{ \Carbon\Carbon::parse($invoice->due_date)->format('d F Y') }}</div>
                </td>
                <td class="right">
                    <div>
                        <h6>Payment Term :</h6>
                    </div>
                    <div>{{ $invoice->payment_term }}</div>
                </td>
            </tr>
        </table>
    </div>

    @php
        $subtotal = 0;
        $ppn = $invoice->ppn;
        $nilai_ppn = $invoice->nilai_ppn;
        $pengurang_harga = $invoice->pengurang_harga ?? 0;
        $discount = $invoice->discount ?? 0;
        $nilai_discount = ($subtotal * $discount) / 100;
    @endphp

    <table class="custom-table">
        <thead>
            <tr class="head-table">
                <th scope="col">No</th>
                <th scope="col">Produk / Jasa</th>
                <th scope="col">Qty</th>
                <th scope="col">Satuan</th>
                <th scope="col">Harga Satuan</th>
                <th scope="col">Total Harga</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($invoiceDetail as $row)
                @php
                    $total = $row->price * $row->qty;
                    $subtotal += $total;
                @endphp
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>
                        {{ $row->product->name }}
                        @if ($row->note)
                            <div class="product-note">{{ $row->note }}</div>
                            <!-- Note displayed below the product name -->
                        @endif
                    </td>
                    <td>{{ $row->qty }}</td>
                    <td>{{ $row->product->unit }}</td>
                    <td>{{ 'Rp. ' . number_format($row->price, 0, ',', '.') }}</td>
                    <td>{{ 'Rp. ' . number_format($total, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" style="text-align: center;">Data Kosong</td>
                </tr>
            @endforelse

            <tr>
                <td colspan="5" class="total">Subtotal</td>
                <td>{{ 'Rp. ' . number_format($subtotal, 0, ',', '.') }}</td>
            </tr>

            @if ($discount > 0)
                <tr>
                    <td colspan="5" class="total">Discount ({{ $discount }}%)</td>
                    <td>{{ 'Rp. ' . number_format($nilai_discount, 0, ',', '.') }}</td>
                </tr>
            @endif

            <tr>
                <td colspan="5" class="total">PPN ({{ $ppn }}%)</td>
                <td>{{ 'Rp. ' . number_format($nilai_ppn, 0, ',', '.') }}</td>
            </tr>

            <tr>
                <td colspan="5" class="total">Total + PPN</td>
                <td>{{ 'Rp. ' . number_format($subtotal - $nilai_discount + $nilai_ppn, 0, ',', '.') }}</td>
            </tr>

            @if ($pengurang_harga > 0)
                <tr>
                    <td colspan="5" class="total">Pengurangan Kode Unik</td>
                    <td>{{ 'Rp. ' . number_format($pengurang_harga, 0, ',', '.') }}</td>
                </tr>
            @endif

            <tr>
                <td colspan="5" class="total">Total Keseluruhan</td>
                <td>{{ 'Rp. ' . number_format($subtotal - $nilai_discount + $nilai_ppn - $pengurang_harga, 0, ',', '.') }}
                </td>
            </tr>
        </tbody>
    </table>
    </div>
</body>

</html>

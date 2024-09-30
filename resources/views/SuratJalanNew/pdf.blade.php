<!DOCTYPE html>
<html>

<head>
    <title>Surat Jalan</title>
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
    </style>
</head>

<body>
    <table class="w-full mb-4">
        <tr>
            <td class="w-center">
                <img src="{{ public_path('/img/kop-atas-pdf.png') }}" alt="kop-atas-pdf" style="width: 90%" />
            </td>
            <td class="w-half">
                <div><span style="margin-right:33px;">No. Surat </span> : {{ $suratJalanNew->no_surat }}</div>
                <div><span style="margin-right:56px;">Page </span> : 1/1</div>
                <div><span style="margin-right:15px;">Delivery date </span> :
                    {{ \Carbon\Carbon::parse($suratJalanNew->tanggal_kirim)->format('d F Y') }}</div>
            </td>
        </tr>
    </table>

    <h1 style="margin-left:40%; margin-top: 30px; margin-bottom:-30px;">Surat Jalan</h1>
    <div style="margin-bottom: 40px;">
        <table class="w-full">
            <tr>
                <td class="left">
                    <div>
                        <h6>Customer :</h6>
                    </div>
                    <div style="text-decoration: underline;">{{ $suratJalanNew->customer->name }}</div>
                </td>
                <td class="right">
                    <div>
                        <h6>shipping address :</h6>
                    </div>
                    <div>{{ $suratJalanNew->customer->address }}</div>
                </td>
            </tr>
        </table>
    </div>

    <p class="text">Bersama ini kami kirimkan barang barang tersebut dibawah ini:</p>
    @php
        $subtotal = 0;
    @endphp

    <table class="custom-table">
        <thead>
            <tr class="head-table">
                <th scope="col">No</th>
                <th scope="col">Produk / Paket</th>
                <th scope="col">Qty</th>
                <th scope="col">Satuan</th>
                <th scope="col">Harga Satuan</th>
                <th scope="col">Keterangan</th>
                <th scope="col">Total Harga</th>
            </tr>
        </thead>
        <tbody>
            @forelse ($suratJalan as $row)
                @php
                    $total = $row->price * $row->qty;
                    $subtotal += $total;
                @endphp
                <tr>
                    <th scope="row">{{ $loop->iteration }}</th>
                    <td>{{ $row->product_name }}</td>
                    <td>{{ $row->qty }}</td>
                    <td>{{ $row->unit }}</td>
                    <td>{{ 'Rp. ' . number_format($row->price, 0, ',', '.') }}</td>
                    <td>{{ $row->note }}</td>
                    <td>{{ 'Rp. ' . number_format($total, 0, ',', '.') }}</td>
                </tr>

            @empty
                <tr>
                    <td colspan="7" style="text-align: center;">Data Kosong</td>
                </tr>
            @endforelse

            <tr>
                <td colspan="6" class="total">Total Keseluruhan</td>
                <td>{{ 'Rp. ' . number_format($subtotal, 0, ',', '.') }}
                </td>
            </tr>
        </tbody>
    </table>

    <div class="margin-top">
        <table class="w-full" style="text-align: center;">
            <tr>
                <td class="w-half text-center">
                    <div>Penerima</div>
                    <div style="margin-top: 60px;">(........................................)</div>
                </td>
                <td class="w-half text-center">
                    <div>Hormat Kami</div>
                    <div style="margin-top: 60px;">
                        <div style="font-weight: bold; text-decoration: underline;">INDRI PRATIWI</div>
                        <div>Direktur</div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>

</html>

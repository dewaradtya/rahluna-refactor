<!DOCTYPE html>
<html>

<head>
    <title>{{ $purchase->project->name }} - Purchase Order</title>
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

        .w-full {
            width: 100%;
        }

        .w-half {
            width: 45%;
        }

        .w-center {
            width: 55%;
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

        .btn-gray {
            background-color: rgb(217, 215, 215);
            border: none;
            padding: 5px 35px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            margin-left: 100px;
            cursor: pointer;
        }

        .custom-hr {
            width: 50%;
            border: 1px solid #cecece;
            margin: 5px 0px;
            margin-top: -10px;
        }

        .text {
            margin: 0px;
            width: 70%;
        }
    </style>
</head>
<table class="w-full mb-4">
    <tr>
        <td>
            <img src="{{ public_path('/img/apple-touch-icon.png') }}" alt="nugroho" width="50"
                style="margin-top: 12px;" />
        </td>
        <td class="w-center">
            <div>
                <h3 style="margin-bottom: -4px;">PT. Nugroho Abadi Sentosa</h3>
            </div>
            <div>HOSPITAL and LABORATORY GENERAL SUPPLIER</div>
            <div>MAINTENANCE and REPAIR</div>
        </td>
        <td class="w-half">
            <button class="btn-gray">Purchase Order</button>
            <div>
                <span style="margin-right:28px;">Referensi</span> : <span
                    style="margin-left:95px;">{{ $purchase->referensi }}</span>
            </div>
            <div>
                <span style="margin-right:37px;">Tanggal </span>: <span
                    style="margin-left:115px;">{{ \Carbon\Carbon::parse($purchase->date)->format('d/m/Y') }}</span>
            </div>
            <div>
                <span style="margin-right:8px;">Delivery Date </span>: <span
                    style="margin-left:115px;">{{ \Carbon\Carbon::parse($purchase->delivery_date)->format('d/m/Y') }}</span>
            </div>
        </td>
    </tr>
</table>

<div class="margin-top">
    <div>
        <p style="font-weight: 900;">Supplier:</p>
        <hr class="custom-hr">
        <p style="font-weight: 900; margin-top: -15px;">{{ $purchase->supply }}</p>
    </div>
    <div>
        <p style="font-weight: 900;">Alamat Pengiriman:</p>
        <div style="margin-bottom: 20px; margin-top: -15px;">{{ $purchase->address }}</div>
    </div>
</div>

<p style="margin-bottom: 5px">Bersama ini kami mohon dikirimkan barang-barang tersebut di bawah ini:</p>
@if (!empty($projectDetails) && $projectDetails->count() > 0)
    <table class="custom-table">
        <thead>
            <tr class="head-table">
                <th scope="col">Produk Name</th>
                <th scope="col">Qty</th>
                <th scope="col">Unit Price (Exc PPN)</th>
                <th scope="col">Total Price</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($projectDetails as $detail)
                <tr>
                    <td>{{ $detail->product }}</td>
                    <td>{{ $detail->qty }}</td>
                    <td>Rp. {{ number_format($detail->amount, 0, ',', '.') }}</td>
                    <td>Rp. {{ number_format($detail->qty * $detail->amount, 0, ',', '.') }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
@else
    <table class="custom-table">
        <thead>
            <tr class="head-table">
                <th scope="col">Produk Name</th>
                <th scope="col">Qty</th>
                <th scope="col">Unit Price (Exc PPN)</th>
                <th scope="col">Total Price</th>
            </tr>
        </thead>
        <tbody>
            <td colspan="5">Data produk tidak ada</td>
        </tbody>
    </table>
@endif

<p style="width: 70%; margin-bottom:100px; margin-top: 20px;">Mohon dapat segera diberikan order konfirmasi/persetujuan
    atas penjualan kami ini. Atas
    perhatian dan kerjasamanya kami ucapkan terimakasih.</p>

<div style="margin-left: 70%; text-align: center;">
    <div>Hormat Kami,</div>
    <div style="margin-top: 60px;">
        <div style="font-weight: bold; text-decoration: underline;">Yessy Ummafiyanti</div>
        <div>Direktur</div>
    </div>
</div>

</body>

</html>

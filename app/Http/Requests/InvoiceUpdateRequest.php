<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class InvoiceUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'referensi' => 'required|string',
            'date' => 'required|date',
            'nama_invoice' => 'required|string',
            'payment_term' => 'required|string',
            'kwitansi' => 'required|string',
            'note' => 'required|string',
            'due_date' => 'required|date',
            'discount' => 'nullable|integer',
            'ppn' => 'nullable|integer',
            'faktur_pajak' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SuratJalanNewStoreRequest extends FormRequest
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
            'no_surat' => 'required|integer',
            'tanggal_kirim' => 'required|date',
            'customer_id' => 'required|exists:customers,id',
        ];
    }
}

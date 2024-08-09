<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class OprasionalUpdateRequest extends FormRequest
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
            'date' => 'required|date',
            'description' => 'required|string',
            'amount' => 'required|decimal:0,2',
            'funding' => 'required|string',
            'proof' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
            'tax_id' => 'nullable|integer|exists:taxes,id',
        ];
    }

    public function attributes(): array
    {
        return [
            'date' => 'tanggal',
            'description' => 'keterangan',
            'amount' => 'nilai',
            'funding' => 'dana',
            'proof' => 'bukti',
            'tax_id' => 'pajak',
        ];
    }
}

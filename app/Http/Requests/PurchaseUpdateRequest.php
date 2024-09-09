<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class PurchaseUpdateRequest extends FormRequest
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
            'referensi' => 'required|string',
            'supply' => 'required|string',
            'address' => 'required|string',
            'delivery_date' => 'required|date',
            'tax_invoice' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
            'purchase_invoice' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
        ];
    }
}

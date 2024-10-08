<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SuratJalanStoreRequest extends FormRequest
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
            'product_id' => 'required|exists:products,id',
            'qty' => 'required|integer|min:1',
            'note' => 'nullable|string',
            'customer_id' => 'required|exists:customers,id',
        ];
    }
}

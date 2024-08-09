<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ManageReceivableDetailStoreRequest extends FormRequest
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
            'proof' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
            'oprasional_id' => 'required|exists:oprasionals,id',
        ];
    }
}

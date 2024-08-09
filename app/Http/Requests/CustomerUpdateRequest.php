<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerUpdateRequest extends FormRequest
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
            'name' => "required|string",
            'pic' => 'required|string',
            'telp' => 'nullable|max_digits:16',
            'email' => 'nullable|email',
            'address' => 'nullable|string',
            'identity' => 'nullable|mimes:png,jpg,jpeg|max:2048',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectStoreRequest extends FormRequest
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
            'name' => 'required|string',
            'deadline' => 'required|date',
            'nilai_penawaran' => 'required|decimal:0,2',
            'file_po' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
            'customer_id' => 'required|exists:customers,id',
        ];
    }
}

<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ProjectUangKeluarStoreRequest extends FormRequest
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
            'project_id' => 'required|exists:projects,id',
            'requirement' => 'required|string',
            'amount' => 'required|decimal:0,2',
            'note' => 'nullable|string',
            'tax_id' => 'nullable|integer|exists:taxes,id',
            'debt_info' => 'nullable|integer',
            'proof' => 'nullable|mimes:jpeg,png,jpg,pdf|max:2048',
        ];
    }
}

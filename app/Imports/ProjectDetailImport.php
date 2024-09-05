<?php

namespace App\Imports;

use App\Models\ProjectDetail;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Illuminate\Support\Facades\Validator;

class ProjectDetailImport implements ToModel, WithHeadingRow
{
    protected $projectId;

    public function __construct($projectId)
    {
        $this->projectId = $projectId;
    }

    public function model(array $row)
    {
        $validator = Validator::make($row, [
            'tanggal' => 'required|date',
            'kebutuhan' => 'required|string',
            'keterangan' => 'nullable|string',
            'nilai' => 'required|numeric'
        ]);

        return new ProjectDetail([
            'date' => $row['tanggal'],
            'requirement' => $row['kebutuhan'],
            'note' => $row['keterangan'],
            'amount' => $row['nilai'],
            'project_id' => $this->projectId,
            'user_id' => 1, 
        ]);
    }
}

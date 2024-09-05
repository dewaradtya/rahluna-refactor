<?php

namespace App\Exports;

use App\Models\ProjectDetail;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithTitle;

class ProjectDetailExport implements FromCollection, WithHeadings, WithTitle
{
    protected $projectId;

    public function __construct($projectId)
    {
        $this->projectId = $projectId;
    }

    public function collection()
    {
        return ProjectDetail::where('project_id', $this->projectId)
            ->select('date', 'requirement', 'note', 'amount')
            ->groupBy('date', 'requirement', 'note', 'amount')
            ->get();
    }

    public function headings(): array
    {
        return ['Tanggal', 'Kebutuhan', 'Keterangan', 'Nilai'];
    }

    public function title(): string
    {
        return 'Project Detail';
    }
}

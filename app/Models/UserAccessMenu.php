<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UserAccessMenu extends Model
{
    use HasFactory;

    protected $fillable = ['user_role_id', 'menu_id'];

    public function role()
    {
        return $this->belongsTo(UserRole::class, 'user_role_id');
    }

    public function menu()
    {
        return $this->belongsTo(Menu::class, 'menu_id');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\RedirectResponse;
use App\Http\Requests\MenuStoreRequest;
use App\Http\Requests\MenuUpdateRequest;
use Illuminate\Support\Facades\Redirect;

class MenuController extends Controller
{
    public function index(Request $request): Response
    {
        $perPage = $request->query('perPage') ?? 100;

        $groupMenus = Menu::distinct()->groupBy('group_menu')->pluck('group_menu');
        $menus = Menu::paginate($perPage)->appends($request->query());

        return Inertia::render('Menu/Index', compact('menus', 'groupMenus'));
    }

    public function store(MenuStoreRequest $request): RedirectResponse
    {
        try {
            $validatedData = $request->validated();
            $validatedData['is_active'] = ($request->is_active) ? true : false;
            Menu::create($validatedData);

            return Redirect::back()->with('success', 'Menu berhasil ditambahkan');
        } catch (\Exception $e) {
            Log::error('Error storing menu: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menambah menu. Silahkan coba lagi.');
        }
    }

    public function update(MenuUpdateRequest $request, int $menu): RedirectResponse
    {
        try {
            $menu = Menu::findOrFail($menu);

            $validatedData = $request->validated();
            $validatedData['is_active'] = ($request->is_active) ? true : false;
            $menu->update($validatedData);

            return Redirect::back()->with('success', 'Menu berhasil diubah');
        } catch (\Exception $e) {
            Log::error('Error updating menu: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat mengubah menu. Silahkan coba lagi.');
        }
    }

    public function destroy(int $menu): RedirectResponse
    {
        try {
            $menu = Menu::findOrFail($menu);
            $menu->delete();

            return Redirect::back()->with('success', 'Menu berhasil dihapus');
        } catch (\Exception $e) {
            Log::error('Error deleting menu: ', ['exception' => $e]);
            return Redirect::back()->with('error', 'Terjadi kesalahan saat menghapus menu. Silahkan coba lagi.');
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DepartmentController extends Controller
{
    public function index(): Response
    {
        $departments = Department::orderByDesc('id')->get(['id','department_name','department_head']);

        return Inertia::render('Department/Index', [
            'user' => auth()->user(),
            'department' => $departments,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'department_name' => 'required|string|max:255',
            'department_head' => 'nullable|string|max:255',
        ]);

        Department::create([
            'department_name' => $data['department_name'],
            'department_head' => $data['department_head'] ?? null,
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('department.index');
    }

    public function update(Request $request, Department $department)
    {
        $data = $request->validate([
            'department_name' => 'required|string|max:255',
            'department_head' => 'nullable|string|max:255',
        ]);

        $department->update($data);

        return redirect()->route('department.index');
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return redirect()->route('department.index');
    }
}

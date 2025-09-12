<?php

namespace App\Http\Controllers;

use App\Models\layout;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\Event;
use App\Models\User;
use App\Models\Project;
use App\Models\Holiday;
use App\Models\Gallery;
use App\Models\Department;
use App\Models\Lead;
use App\Models\Applicant;
use App\Models\Report;

class LayoutController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $layouts = layout::all();

        $stats = [
            'totalEvents' => Event::count(),
            'totalUsers' => User::count(),
            'totalProjects' => Project::count(),
            'totalHolidays' => Holiday::count(),
            'totalGallery' => Gallery::count(),
            'totalDepartments' => Department::count(),
            'totalReports' => Report::count(),
            'totalLeads' => Lead::count(),
        ];

        $features = [
            [ 'id' => 1, 'title' => 'Employee Management', 'description' => 'Efficiently manage all employee data in one centralized system.', 'icon' => 'users' ],
            [ 'id' => 2, 'title' => 'Payroll Processing', 'description' => 'Automate payroll calculations and disbursements with accuracy.', 'icon' => 'wallet' ],
            [ 'id' => 3, 'title' => 'Time & Attendance', 'description' => 'Track employee hours, leaves, and attendance seamlessly.', 'icon' => 'clock' ],
            [ 'id' => 4, 'title' => 'Performance Reviews', 'description' => 'Streamline performance evaluation and feedback processes.', 'icon' => 'bar-chart' ],
        ];

        $faqs = [
            [ 'question' => 'How secure is our employee data?', 'answer' => 'We use industry-standard encryption and security protocols to ensure all your data remains protected.' ],
            [ 'question' => 'Can we integrate with our existing systems?', 'answer' => 'Yes, our HRMS offers API integrations with most popular business software and tools.' ],
            [ 'question' => 'What kind of support do you provide?', 'answer' => 'We offer 24/7 customer support, onboarding assistance, and comprehensive documentation.' ],
        ];

        $testimonials = [
            [ 'name' => 'Dikshant Sharma', 'role' => 'HR Director, TechCorp', 'content' => 'This HRMS has transformed how we manage our workforce. The automation features saved us 20 hours per week.', 'avatar' => 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwUxAH2sitH1SVQ2k-7tLmVQ1CbR1ddY7r1g&s' ],
            [ 'name' => 'Anveshi Jain', 'role' => 'Operations Manager, StartUp Inc', 'content' => 'Implementation was seamless, and our team adapted quickly. The reporting features are exceptional.', 'avatar' => 'https://img.freepik.com/free-photo/beautiful-girl-stands-park_8353-5084.jpg' ],
        ];

        return Inertia::render('Layout/Index', [
            'user' => auth()->user(),
            'layout' => $layouts,
            'stats' => $stats,
            'features' => $features,
            'faqs' => $faqs,
            'testimonials' => $testimonials,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(layout $layout)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(layout $layout)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, layout $layout)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(layout $layout)
    {
        //
    }
}

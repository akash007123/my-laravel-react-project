<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = [
            [
                'title' => 'Tech Conference 2024',
                'description' => 'Join us for the biggest tech conference of the year featuring keynote speakers, workshops, and networking opportunities.',
                'event_date' => '2024-12-15',
                'start_time' => '09:00',
                'end_time' => '17:00',
                'location' => 'Convention Center, Downtown',
                'capacity' => 500,
                'status' => 'upcoming',
                'organizer' => 'Tech Events Inc.',
                'tags' => ['technology', 'conference', 'networking'],
            ],
            [
                'title' => 'Startup Meetup',
                'description' => 'Monthly meetup for startup founders and entrepreneurs to share ideas and experiences.',
                'event_date' => '2024-11-20',
                'start_time' => '18:30',
                'end_time' => '21:00',
                'location' => 'Innovation Hub, Tech District',
                'capacity' => 100,
                'status' => 'upcoming',
                'organizer' => 'Startup Community',
                'tags' => ['startup', 'entrepreneurship', 'networking'],
            ],
            [
                'title' => 'Web Development Workshop',
                'description' => 'Hands-on workshop covering modern web development techniques and best practices.',
                'event_date' => '2024-10-25',
                'start_time' => '10:00',
                'end_time' => '16:00',
                'location' => 'Code Academy, Learning Center',
                'capacity' => 50,
                'status' => 'upcoming',
                'organizer' => 'Code Academy',
                'tags' => ['web development', 'workshop', 'learning'],
            ],
            [
                'title' => 'Design Sprint',
                'description' => 'A 5-day process for answering critical business questions through design, prototyping, and testing ideas with customers.',
                'event_date' => '2024-09-30',
                'start_time' => '09:00',
                'end_time' => '17:00',
                'location' => 'Design Studio, Creative Quarter',
                'capacity' => 30,
                'status' => 'upcoming',
                'organizer' => 'Design Collective',
                'tags' => ['design', 'sprint', 'prototyping'],
            ],
            [
                'title' => 'AI and Machine Learning Summit',
                'description' => 'Explore the latest developments in artificial intelligence and machine learning with industry experts.',
                'event_date' => '2024-08-15',
                'start_time' => '08:30',
                'end_time' => '18:30',
                'location' => 'AI Research Center',
                'capacity' => 200,
                'status' => 'completed',
                'organizer' => 'AI Research Institute',
                'tags' => ['AI', 'machine learning', 'research'],
            ],
        ];

        foreach ($events as $eventData) {
            Event::create($eventData);
        }
    }
}

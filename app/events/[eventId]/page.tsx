import { notFound } from 'next/navigation';
import { getEventFolders } from "@/app/services/eventService";


export async function generateStaticParams() {
    const events = await getEventFolders();
    return events.map(event => ({
        eventId: event.id,
    }));
}

export const revalidate = 3600; // Revalidate every hour

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
    const { eventId } = await params;
    const events = await getEventFolders();
    const event = events.find(e => e.id === eventId);

    if (!event) {
        notFound();
    }

    return (
        <div>
            <h1>{event.name}</h1>
            <p>ID: {event.id}</p>
        </div>
    );
}
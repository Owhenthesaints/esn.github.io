import {prisma} from "@/lib/prisma";

export async function createEventRow(data: {
    title: string,
    eventDate: Date,
    driveFolderId: string,
    eventDescription: string,
    signupDescription: string,
    location: string,
    signupDeadline?: Date,
    eventEndDate?: Date
}) {
    const newEvent = await prisma.event.create({
        data: {
            title: data.title,
            eventDate: new Date(data.eventDate),
            driveFolderId: data.driveFolderId,
            eventDescription: data.eventDescription,
            signupDescription: data.signupDescription,
            location: data.location,
            signupDeadline: new Date("2025-06-01"),
            eventEndDate: new Date("2025-06-16"),
        },
    });

    console.log(newEvent);
}

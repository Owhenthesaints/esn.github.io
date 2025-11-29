
export interface EventInterface {
    folderId: string;
    title: string;
    createdAt: Date;
    eventDate: Date;
    eventEndDate?: Date;
    location?: string;
    eventDescription: string;
    signupDescription: string;
    signupDeadline?: Date;
    displayed: boolean;
    updatedAt: Date;
}

export enum SPREADSHEET_EVENT_KEYS {
    EVENT_DATE = 'event date',
    EVENT_DESCRIPTION = 'event description',
    SIGNUP_DESCRIPTION = 'signup description',
    DISPLAYED = 'displayed',
    SIGNUP_DEADLINE = 'signup deadline',
    EVENT_END_DATE = 'event end date',
    LOCATION = 'location',
}
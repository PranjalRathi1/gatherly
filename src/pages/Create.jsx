import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/layout/PageWrapper';
import CreateEventModal from '../components/event/CreateEventModal';
import { useEventStore } from '../store/eventStore';

const Create = () => {
    const navigate = useNavigate();
    const { addEvent } = useEventStore();
    const [showModal, setShowModal] = useState(true);

    const handleCreateEvent = (eventData) => {
        const newEvent = {
            id: Date.now(),
            ...eventData,
            participants: 1
        };
        addEvent(newEvent);
        setShowModal(false);
        navigate(`/event/${newEvent.id}`);
    };

    const handleClose = () => {
        setShowModal(false);
        navigate('/discover');
    };

    return (
        <PageWrapper>
            <CreateEventModal
                isOpen={showModal}
                onClose={handleClose}
                onSubmit={handleCreateEvent}
            />
        </PageWrapper>
    );
};

export default Create;

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import authApi from "@/api/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PendingUser {
    _id: string;
    username: string;
    email: string;
}

const AdminDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user?.role !== "admin") {
            navigate("/events");
            return;
        }

        fetchPending();
    }, [user]);

    const fetchPending = async () => {
        try {
            setLoading(true);
            const data = await authApi.getPendingCreators();
            setPendingUsers(data);
        } catch {
            alert("Failed to fetch pending users");
        } finally {
            setLoading(false);
        }
    };

    const approveUser = async (id: string) => {
        try {
            await authApi.approveCreator(id);
            fetchPending();
        } catch {
            alert("Approval failed");
        }
    };

    const rejectUser = async (id: string) => {
        try {
            await authApi.rejectCreator(id);
            fetchPending();
        } catch {
            alert("Rejection failed");
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Pending Creator Requests</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    {loading ? (
                        <p>Loading...</p>
                    ) : pendingUsers.length === 0 ? (
                        <p>No pending requests</p>
                    ) : (
                        pendingUsers.map((pendingUser) => (
                            <div
                                key={pendingUser._id}
                                className="flex justify-between items-center border p-4 rounded-lg bg-white/50 dark:bg-zinc-800/50"
                            >
                                <div>
                                    <p className="font-semibold">
                                        {pendingUser.username}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {pendingUser.email}
                                    </p>
                                </div>

                                <div className="flex gap-2">
                                    <Button
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => approveUser(pendingUser._id)}
                                    >
                                        Approve
                                    </Button>

                                    <Button
                                        variant="destructive"
                                        onClick={() => rejectUser(pendingUser._id)}
                                    >
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminDashboard;
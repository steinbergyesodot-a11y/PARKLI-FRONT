import { useState } from "react";
import { ownerProfileService } from "../services/ownerProfileService";

type EditableField = "firstName" | "lastName" | "email";

type ProfileDetailsProps = {
    userId: string;
    authProvider: string;
    firstName: string;
    lastName: string;
    email: string;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setEmail: (value: string) => void;
};

const fieldLabels: Record<EditableField, string> = {
    firstName: "First name",
    lastName: "Last name",
    email: "Email address",
};

export function ProfileDetails({
    userId,
    authProvider,
    firstName,
    lastName,
    email,
    setFirstName,
    setLastName,
    setEmail,
}: ProfileDetailsProps) {
    const isLocalAccount = authProvider === "local";
    const [editingField, setEditingField] = useState<EditableField | "">("");
    const [tempValue, setTempValue] = useState("");
    const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
    const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ field: EditableField; value: string } | null>(null);
    const [savingField, setSavingField] = useState<EditableField | null>(null);

    function startEditing(field: EditableField, value: string) {
        setEditingField(field);
        setTempValue(value);
        setFeedbackMessage(null);
        setFeedbackType(null);
        setConfirmAction(null);
    }

    function cancelEditing() {
        if (savingField) {
            return;
        }

        setEditingField("");
        setTempValue("");
        setConfirmAction(null);
    }

    function requestSave(field: EditableField) {
        const nextValue = tempValue.trim();

        if (!nextValue) {
            setFeedbackMessage(`${fieldLabels[field]} cannot be empty.`);
            setFeedbackType("error");
            return;
        }

        setFeedbackMessage(null);
        setFeedbackType(null);
        setConfirmAction({ field, value: nextValue });
    }

    async function confirmSave() {
        if (!confirmAction) {
            return;
        }

        setSavingField(confirmAction.field);

        try {
            if (confirmAction.field === "firstName") {
                await ownerProfileService.updateFirstName(userId, confirmAction.value);
                setFirstName(confirmAction.value);
            }

            if (confirmAction.field === "lastName") {
                await ownerProfileService.updateLastName(userId, confirmAction.value);
                setLastName(confirmAction.value);
            }

            if (confirmAction.field === "email") {
                await ownerProfileService.updateEmail(userId, confirmAction.value);
                setEmail(confirmAction.value);
            }

            setEditingField("");
            setTempValue("");
            setConfirmAction(null);
            setFeedbackMessage("Profile updated successfully.");
            setFeedbackType("success");
        } catch (error) {
            console.log(error);
            setFeedbackMessage("Could not save changes right now. Please try again.");
            setFeedbackType("error");
        } finally {
            setSavingField(null);
        }
    }

    function renderField(field: EditableField, value: string, editable: boolean) {
        const isEditing = editingField === field;

        return (
            <div className={`profile-field-card ${isEditing ? "editing" : ""}`}>
                <div className="profile-field-copy">
                    <span className="profile-field-label">{fieldLabels[field]}</span>
                    {isEditing ? (
                        <input
                            className="profile-field-input"
                            value={tempValue}
                            onChange={(event) => setTempValue(event.target.value)}
                            disabled={savingField === field}
                        />
                    ) : (
                        <span className="profile-field-value">{value || "Not set"}</span>
                    )}
                </div>

                <div className="profile-field-actions">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                className="profile-save-btn"
                                onClick={() => requestSave(field)}
                                disabled={savingField === field}
                            >
                                {savingField === field ? "Saving..." : "Save"}
                            </button>
                            <button
                                type="button"
                                className="profile-cancel-btn"
                                onClick={cancelEditing}
                                disabled={savingField === field}
                            >
                                Cancel
                            </button>
                        </>
                    ) : (
                        editable && (
                            <button
                                type="button"
                                className="profile-edit-btn"
                                onClick={() => startEditing(field, value)}
                            >
                                Edit
                            </button>
                        )
                    )}
                </div>
            </div>
        );
    }

    return (
        <section className="profile-panel">
            <div className="profile-panel-header">
                <div>
                    <h2 className="profile-panel-title">My Profile</h2>
                    <p className="profile-panel-subtitle">Review and update your account details.</p>
                </div>
                <div className="profile-panel-chip">{authProvider === "local" ? "Local account" : "Connected account"}</div>
            </div>

            {feedbackMessage && (
                <div className={`profile-feedback ${feedbackType === "error" ? "error" : "success"}`}>
                    {feedbackMessage}
                </div>
            )}

            <div className="profile-fields-grid">
                {isLocalAccount && renderField("firstName", firstName, true)}
                {isLocalAccount && renderField("lastName", lastName, true)}
                {renderField("email", email, true)}
            </div>

            {confirmAction && (
                <div className="profile-confirm-overlay" onClick={() => setConfirmAction(null)}>
                    <div
                        className="profile-confirm-box"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="profile-confirm-title"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h3 id="profile-confirm-title">Save changes?</h3>
                        <p>
                            Update {fieldLabels[confirmAction.field].toLowerCase()} to <strong>{confirmAction.value}</strong>?
                        </p>
                        <div className="profile-confirm-actions">
                            <button
                                type="button"
                                className="profile-confirm-yes"
                                onClick={() => void confirmSave()}
                                disabled={savingField !== null}
                            >
                                {savingField ? "Saving..." : "Yes, save"}
                            </button>
                            <button
                                type="button"
                                className="profile-confirm-no"
                                onClick={() => setConfirmAction(null)}
                                disabled={savingField !== null}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

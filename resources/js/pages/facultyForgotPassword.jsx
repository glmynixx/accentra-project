import ForgotPasswordResetLink from '../components/auth/forgotPasswordResetLink';

export default function FacultyForgotPassword() {
    return (
        <ForgotPasswordResetLink
            accountType="faculty"
            loginUrl="/faculty/login"
            sendResetLinkUrl="/faculty/forgot-password/send-link"
        />
    );
}

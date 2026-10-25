import ForgotPasswordResetLink from '../components/auth/forgotPasswordResetLink';

export default function StudentForgotPassword() {
    return (
        <ForgotPasswordResetLink
            accountType="student"
            loginUrl="/student/login"
            sendResetLinkUrl="/student/forgot-password/send-link"
        />
    );
}

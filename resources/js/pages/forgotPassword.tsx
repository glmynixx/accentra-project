import ForgotPasswordResetLink from '../components/auth/forgotPasswordResetLink';

export default function ForgotPassword() {
    return (
        <ForgotPasswordResetLink
            accountType="administrator"
            loginUrl="/login"
            sendResetLinkUrl="/forgot-password/send-link"
        />
    );
}

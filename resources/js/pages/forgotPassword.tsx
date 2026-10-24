import ForgotPasswordOtp from '../components/auth/forgotPasswordOtp';

export default function ForgotPassword() {
    return (
        <ForgotPasswordOtp
            accountType="administrator"
            loginUrl="/login"
            sendOtpUrl="/forgot-password/send-otp"
            resetPasswordUrl="/forgot-password/reset"
        />
    );
}

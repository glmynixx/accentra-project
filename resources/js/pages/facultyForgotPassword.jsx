import ForgotPasswordOtp from '../components/auth/forgotPasswordOtp';

export default function FacultyForgotPassword() {
    return (
        <ForgotPasswordOtp
            accountType="faculty"
            loginUrl="/faculty/login"
            sendOtpUrl="/faculty/forgot-password/send-otp"
            resetPasswordUrl="/faculty/forgot-password/reset"
        />
    );
}

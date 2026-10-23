import ForgotPasswordOtp from '../components/auth/forgotPasswordOtp';

export default function StudentForgotPassword() {
    return (
        <ForgotPasswordOtp
            accountType="student"
            loginUrl="/student/login"
            sendOtpUrl="/student/forgot-password/send-otp"
            resetPasswordUrl="/student/forgot-password/reset"
        />
    );
}

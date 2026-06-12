import { Suspense } from "react";
import { LoginForm } from "../../components/login-form";

export default function StaffLoginPage() {
  return (
    <Suspense>
      <LoginForm appLabel="Staff" variant="dark" />
    </Suspense>
  );
}

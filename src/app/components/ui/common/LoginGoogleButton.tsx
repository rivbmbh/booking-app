import { signIn } from "../../../../auth";
import { FaG } from "react-icons/fa6";

export const LoginGoogleButton = ({ redirectUrl }: { redirectUrl: string }) => {
  return (
    <form
      action={async () => {
        "use server";

        //params kedua: agar supaya user yang blm login dan diarahkan ke halaman login lagi ketika dia sudah login maka akan tetap kembali ke halaman terakhir yang dia akses contohnya: room detail page
        await signIn("google", { redirectTo: redirectUrl });
      }}
    >
      <button className="flex items-center justify-center gap-2 w-full bg-blue-700 text-white font-medium py-3 px-6 text-base rounded-sm hover:bg-blue-600 cursor-pointer">
        <FaG className="size-6" />
        Sign in with google
      </button>
    </form>
  );
};

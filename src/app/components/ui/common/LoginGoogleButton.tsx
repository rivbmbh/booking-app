import Image from "next/image";
import { signIn } from "../../../../auth";

export const LoginGoogleButton = ({ redirectUrl }: { redirectUrl: string }) => {
  return (
    <form
      action={async () => {
        "use server";

        //params kedua: agar supaya user yang blm login dan diarahkan ke halaman login lagi ketika dia sudah login maka akan tetap kembali ke halaman terakhir yang dia akses contohnya: room detail page
        await signIn("google", { redirectTo: redirectUrl });
      }}
    >
      <button className="relative hover:bg-gray-200 w-full h-12 text-gray-900 py-1 px-2 text-base rounded-full cursor-pointer font-medium border border-gray-300 active:scale-105">
        <Image
          src="/icons8-google-96.svg"
          width={38}
          height={38}
          alt="google icon"
          className="absolute left-2 top-1/2 -translate-y-1/2"
        />
        <p className="hidden min-[283px]:inline-block">Sign in with google</p>
      </button>
    </form>
  );
};

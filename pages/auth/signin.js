import { getProviders, signIn } from "next-auth/react";
import Header from "../../components/Header";
import DoggogramLogo from "../../public/doggogram.png";
import Image from "next/image";

export default function SignIn({ providers }) {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center max-h-screen py-2 -mt-2900 px-14 text-center">
      <Image
            src={DoggogramLogo}
            alt="The logo text version"
            objectFit="contain"
            width="1000rem"
            height="250rem"
          />
       <p className="font-xs italic">
            Welcome to Doggogram, where only dog photos are allowed to be posted.
       </p>
        <div className="mt-10">
          {Object.values(providers).map((provider) => (
            <div key={provider.name}>
              <button
                className="p-3 bg-blue-500 rounded-lg text-white"
                onClick={() => signIn(provider.id, { callbackUrl: "/" })}
              >
                Sign in with {provider.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}

/*
// If older than Next.js 9.3
SignIn.getInitialProps = async () => {
  return {
    providers: await getProviders()
  }
}
*/

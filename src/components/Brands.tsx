import AmazonLogo from '@/components/icons/AmazonLogo';
import DropboxLogo from '@/components/icons/DropboxLogo';
import NetflixLogo from '@/components/icons/NetflixLogo';
import SlackLogo from '@/components/icons/SlackLogo';
import SpotifyLogo from '@/components/icons/SpotifyLogo';
import StripeLogo from '@/components/icons/StripeLogo';

export default function Brands() {
  return (
    <section className="bg-black mb-8 w-full py-12 sm:py-24 lg:mt-16 lg:mb-16">
      <div className="fade-in">
        <div className="content-container">
          <div className="-mx-4 flex flex-col items-center justify-center text-center lg:flex-row lg:text-left">
            <div className="mb-12 w-full px-4 lg:mb-0 lg:w-1/2">
              <div className="flex flex-col">
                <h2 className="text-primaryText mb-2 text-4xl font-bold tracking-normal sm:text-5xl 2xl:text-6xl">
                  Trusted by brands
                </h2>
                <h2 className="to-secondaryColor bg-gradient-to-r from-[rgb(111,169,230)] bg-clip-text text-4xl font-bold tracking-normal text-transparent sm:text-5xl 2xl:text-6xl">
                  all over the world
                </h2>
              </div>
            </div>
            <div className="mx-auto w-2/3 sm:w-[38.75rem] lg:mx-0 lg:w-1/2 lg:pl-10">
              <div className="-m-4 flex flex-wrap">
                <div className="flex w-1/2 justify-center py-6 sm:w-1/3"><AmazonLogo /></div>
                <div className="flex w-1/2 justify-center py-6 sm:w-1/3"><DropboxLogo /></div>
                <div className="flex w-1/2 justify-center py-6 sm:w-1/3"><NetflixLogo /></div>
                <div className="flex w-1/2 justify-center py-6 sm:w-1/3"><StripeLogo /></div>
                <div className="flex w-1/2 justify-center py-6 sm:w-1/3"><SpotifyLogo /></div>
                <div className="flex w-1/2 justify-center py-6 sm:w-1/3"><SlackLogo /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

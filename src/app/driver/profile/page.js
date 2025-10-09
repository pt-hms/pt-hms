import Image from "next/image"
import { Icon } from "@iconify/react"
export default function page() {
  return (
    <div className="w-full flex items-center justify-center min-h-screen pb-[94px]">
      <div className="mx-auto w-fit h-fit px-8 flex flex-col items-center justify-center gap-6 bg-[#FFF9F0]shadow-md">
        <div className="w-[240px] h-[240px] relative">
          <Image src={"/profil.jpeg"} alt="Foto Profil Driver" fill={true} className="border-2 border-[#AE8B56] object-top object-cover rounded-full" objectFit="cover" />
        </div>
        <h1 className="text-4xl font-bold text-[#AE8B56]">Sahroni</h1>
        <div className="flex flex-col justify-start gap-3 w-full">
          <div className="flex gap-3 items-center">
            <Icon icon="mdi:car" width={26} height={26} color="#AE8B56" />
            <div className="bg-[#FDE7C5] py-2 px-6 rounded-lg text-center w-full">
              <p className="text-xl text-black">Premium</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="solar:plate-bold" width={26} height={26} color="#AE8B56" />
            <div className="bg-[#FDE7C5] py-2 px-6 rounded-lg text-center w-full">
              <p className="text-xl text-black">B 1234 EVA</p>
            </div>
          </div>
          <div className="flex gap-3 items-center">
            <Icon icon="bi:phone-fill" width={26} height={26} color="#AE8B56" />
            <div className="bg-[#FDE7C5] py-2 px-6 rounded-lg text-center w-full">
              <p className="text-xl text-black">083870911774</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
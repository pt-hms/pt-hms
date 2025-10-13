"use client"
import { Icon } from '@iconify/react'
import React from 'react'

export default function Card({nama,data,bg,text,icon}) {
  return (
    <div className="flex flex-col py-8 px-4 rounded-3xl bg-white text-black w-full lg:w-[45%] items-center gap-6 shadow-md">
            <div className={`p-2 rounded-2xl ${bg} ${text}`}>
              <Icon icon={icon} width={44} height={44} />
            </div>
            <div className="flex flex-col gap-3 justify-center items-center">
              <p className="text-lg">
                Total {nama}
              </p>
              <p className="font-bold text-2xl">
                {data}
              </p>
            </div>
          </div>
  )
}

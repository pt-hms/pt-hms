"use client"
import { Icon } from '@iconify/react'
import React from 'react'

export default function Card({nama,data,bg,text,icon}) {
  return (
    <div className="flex py-8 px-4 rounded-3xl bg-white text-black w-fit items-center gap-12 justify-between">
            <div className="flex flex-col justify-between">
              <p className="text-lg">
                Total {nama}
              </p>
              <p className="font-bold text-2xl">
                {data}
              </p>
            </div>
            <div className={`p-2 rounded-2xl ${bg} ${text}`}>
              <Icon icon={icon} width={40} height={40} />
            </div>
          </div>
  )
}

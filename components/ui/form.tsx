"use client"

import * as React from "react"
import { Controller, FormProvider, useFormContext } from "react-hook-form"

export const Form = FormProvider

export const FormField = Controller

export const FormItem = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-2">{children}</div>
}

export const FormLabel = ({ children }: { children: React.ReactNode }) => {
  return <label className="text-sm font-medium">{children}</label>
}

export const FormControl = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export const FormMessage = ({ children }: { children?: React.ReactNode }) => {
  if (!children) return null
  return <p className="text-sm text-red-500">{children}</p>
}
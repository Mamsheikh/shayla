"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon } from "lucide-react"
import { Controller, useForm, useWatch } from "react-hook-form"

import { createBot } from "@/action/bots"
import { ChatAvatar } from "@/components/chat-avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { createBotSchema, type CreateBotInput } from "@/db/schema"

const suggestedJobs = [
  {
    job: "Research assistant",
    instructions:
      "Answer briefly, cite reliable sources, and say when the evidence is uncertain.",
  },
  {
    job: "Code reviewer",
    instructions:
      "Look for bugs, security risks, and maintainability issues. Explain each finding with a concrete fix.",
  },
  {
    job: "Writing editor",
    instructions:
      "Improve clarity, structure, and tone while preserving the author's meaning. Explain major edits briefly.",
  },
  {
    job: "Tutor",
    instructions:
      "Explain concepts step by step, adapt to the learner's level, and use examples and questions to check understanding.",
  },
]

export function BotsDialog({
  initialSeed,
  open: controlledOpen,
  onOpenChange,
}: {
  initialSeed: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen ?? internalOpen
  const form = useForm<CreateBotInput>({
    resolver: zodResolver(createBotSchema),
    defaultValues: {
      avatar: initialSeed,
      name: "",
      job: "",
      instructions: "",
    },
  })
  const avatar = useWatch({ control: form.control, name: "avatar" })
  const job = useWatch({ control: form.control, name: "job" })
  const isSubmitting = form.formState.isSubmitting

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
    if (!nextOpen) {
      form.reset({
        avatar: crypto.randomUUID(),
        name: "",
        job: "",
        instructions: "",
      })
    }
  }

  async function onSubmit(values: CreateBotInput) {
    try {
      await createBot(values)
      toast.add({ title: `${values.name.trim()} created` })
      handleOpenChange(false)
    } catch {
      toast.add({
        title: "Could not create bot",
        description: "Please try again.",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <DialogTrigger
          render={
            <Button
              variant="secondary"
              size="lg"
              className="h-12 px-5 text-base"
            />
          }
        >
          <PlusIcon data-icon="inline-start" />
          Create a new bot
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-6 sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-xl">New bot</DialogTitle>
          <DialogDescription className="text-base">
            Give it a face, a name, and a job to do.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <ToggleGroup
            aria-label="Suggested jobs"
            variant="outline"
            size="lg"
            value={
              suggestedJobs.some((suggestion) => suggestion.job === job)
                ? [job]
                : []
            }
            onValueChange={(values) => {
              const suggestion = suggestedJobs.find(
                (item) => item.job === values[0]
              )
              if (suggestion) {
                form.setValue("job", suggestion.job, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
                form.setValue("instructions", suggestion.instructions, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            }}
            className="flex w-full flex-wrap justify-start"
          >
            {suggestedJobs.map((suggestion) => (
              <ToggleGroupItem
                key={suggestion.job}
                value={suggestion.job}
                className="rounded-full"
              >
                {suggestion.job}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <FieldGroup className="gap-6">
            <Field orientation="horizontal" className="items-center gap-4">
              <ChatAvatar seed={avatar} className="size-16 shrink-0" />
              <FieldContent>
                <FieldTitle>Face</FieldTitle>
                <FieldDescription>
                  Shuffle until you find one you like.
                </FieldDescription>
              </FieldContent>
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={() =>
                  form.setValue("avatar", crypto.randomUUID(), {
                    shouldDirty: true,
                  })
                }
                disabled={isSubmitting}
              >
                <ShuffleIcon data-icon="inline-start" />
                Shuffle
              </Button>
            </Field>

            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    className="h-11"
                    placeholder="Ada"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="job"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Job</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    className="h-11"
                    placeholder="Research assistant"
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="instructions"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>
                    How it should work
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id={field.name}
                    placeholder="Answer briefly, cite sources, and ask before running anything destructive."
                    className="min-h-32 resize-y"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter className="-mx-6 -mb-6 px-6">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  disabled={isSubmitting}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" className="h-10" disabled={isSubmitting}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              Create bot
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, ShuffleIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { Controller, useForm, useWatch } from "react-hook-form"

import { createBot, deleteBot, updateBot } from "@/action/bots"
import { ChatAvatar } from "@/components/chat-avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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

type EditableBot = Omit<CreateBotInput, "instructions"> & {
  id: string
  instructions: string | null
}

export function BotsDialog({
  initialSeed,
  bot,
  open: controlledOpen,
  onOpenChange,
}: {
  initialSeed: string
  bot?: EditableBot
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const open = controlledOpen ?? internalOpen
  const initialValues = (): CreateBotInput => ({
    avatar: bot?.avatar ?? initialSeed,
    name: bot?.name ?? "",
    job: bot?.job ?? "",
    instructions: bot?.instructions ?? "",
  })
  const form = useForm<CreateBotInput>({
    resolver: zodResolver(createBotSchema),
    defaultValues: initialValues(),
  })
  const avatar = useWatch({ control: form.control, name: "avatar" })
  const job = useWatch({ control: form.control, name: "job" })
  const isSubmitting = form.formState.isSubmitting
  const isBusy = isSubmitting || isDeleting

  function handleOpenChange(nextOpen: boolean) {
    if (controlledOpen === undefined) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
    if (!nextOpen) {
      form.reset(
        bot
          ? initialValues()
          : { ...initialValues(), avatar: crypto.randomUUID() }
      )
    } else if (bot) {
      form.reset(initialValues())
    }
  }

  async function onSubmit(values: CreateBotInput) {
    try {
      if (bot) {
        await updateBot(bot.id, values)
      } else {
        await createBot(values)
      }
      toast.add({
        title: `${values.name.trim()} ${bot ? "updated" : "created"}`,
      })
      handleOpenChange(false)
    } catch {
      toast.add({
        title: `Could not ${bot ? "update" : "create"} bot`,
        description: "Please try again.",
      })
    }
  }

  async function handleDelete() {
    if (!bot) return

    setIsDeleting(true)
    try {
      await deleteBot(bot.id)
      toast.add({ title: `${bot.name} deleted` })
      setConfirmOpen(false)
      handleOpenChange(false)
      router.replace("/")
    } catch {
      toast.add({
        title: "Could not delete bot",
        description: "Please try again.",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {controlledOpen === undefined && (
        <DialogTrigger
          render={
            bot ? (
              <Button
                type="button"
                variant="ghost"
                className="h-12 min-w-0 flex-1 justify-start gap-3 px-0 text-base"
                aria-label={`Edit ${bot.name}`}
              />
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="h-12 px-5 text-base"
              />
            )
          }
        >
          {bot ? (
            <>
              <ChatAvatar seed={bot.avatar} className="size-10 shrink-0" />
              <span className="min-w-0 truncate font-semibold">{bot.name}</span>
            </>
          ) : (
            <>
              <PlusIcon data-icon="inline-start" />
              Create a new bot
            </>
          )}
        </DialogTrigger>
      )}
      <DialogContent className="max-h-[calc(100dvh-2rem)] gap-6 overflow-y-auto p-6 sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {bot ? "Edit bot" : "New bot"}
          </DialogTitle>
          <DialogDescription className="text-base">
            {bot
              ? "Update its face, name, and job."
              : "Give it a face, a name, and a job to do."}
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
                disabled={isBusy}
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
            {bot && (
              <AlertDialog
                open={confirmOpen}
                onOpenChange={(nextOpen) => {
                  if (!isDeleting) setConfirmOpen(nextOpen)
                }}
              >
                <AlertDialogTrigger
                  render={
                    <Button
                      type="button"
                      variant="destructive"
                      className="h-10 sm:mr-auto"
                      disabled={isBusy}
                    />
                  }
                >
                  Delete bot
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {bot.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete the bot and its direct chats.
                      This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel disabled={isDeleting}>
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      type="button"
                      variant="destructive"
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      {isDeleting && <Spinner data-icon="inline-start" />}
                      Delete bot
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="outline"
                  className="h-10"
                  disabled={isBusy}
                />
              }
            >
              Cancel
            </DialogClose>
            <Button type="submit" className="h-10" disabled={isBusy}>
              {isSubmitting && <Spinner data-icon="inline-start" />}
              {bot ? "Save changes" : "Create bot"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

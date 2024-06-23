"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CopyIcon, Loader2Icon, LockIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ICompany } from "@/models/Company";
import { editCompanyInfo } from "@/actions/editCompanyInfo";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { companyEditSchema } from "@/models/CompanyEdit";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

export type FormState = {
  message: string;
  status?: "success" | "error";
};

const LoadingButton = () => {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2Icon className="animate-spin mr-2 h-4 w-4" /> Loading
        </>
      ) : (
        <>Save Changes</>
      )}
    </Button>
  );
};

const EditCompanyDetail = ({
  company,
  authorized,
}: {
  company: ICompany;
  authorized: boolean;
}) => {
  const { toast } = useToast();
  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [state, formAction] = useFormState<FormState, FormData>(
    editCompanyInfo,
    {
      message: "",
    }
  );

  const form = useForm<z.infer<typeof companyEditSchema>>({
    resolver: zodResolver(companyEditSchema),
    mode: "onChange",
    defaultValues: {
      id: company._id,
      internetAddress: company.internetAddress,
      address: company.address,
      phone: company.contact?.phone,
      email: company.contact?.email,
    },
  });

  useEffect(() => {
    if (!state) {
      return;
    }
    if (state.status === "error") {
      toast({
        variant: "destructive",
        title: state.message,
      });
    }
    if (state.status === "success") {
      toast({
        variant: "default",
        title: state.message,
        className:
          "inline-flex items-center rounded-md bg-green-50 text-xs font-medium text-green-700 border border-green-600/20",
      });
      setDialogOpen(false);
      router.refresh();
    }
  }, [state]);

  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={() => {
        form.reset();
        setDialogOpen(!dialogOpen);
      }}
    >
      <DialogTrigger asChild>
        {!authorized ? (
          <Button variant="ghost" disabled>
            <LockIcon className="w-4 h-4" />
            <span className="ml-2">Edit</span>
          </Button>
        ) : (
          <Button>Edit</Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            ref={formRef}
            className="flex flex-col gap-4"
            action={formAction}
          >
            <FormField
              control={form.control}
              name="internetAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telephone</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="hidden">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input {...field} type="hidden" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="sm:justify-end">
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Close
                </Button>
              </DialogClose>
              <LoadingButton />
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDetail;

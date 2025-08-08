"use client";

import { useActionState } from "react";
import {
  updateProfile,
  type ProfileState,
  type PasswordState,
} from "../_actions/update-profile-action";
import { updatePassword } from "../_actions/update-password-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormItem,
  FormField,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { passwordFormSchema, profileFormSchema } from "@/schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

const initialState: ProfileState & PasswordState = {
  error: undefined,
  user: undefined,
  success: undefined,
};

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function SettingsForm({
  user,
}: {
  user: { name: string | null; bio: string | null };
}) {
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [showPasswords, setShowPasswords] = React.useState(false);

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
    },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const [profileState, profileAction] = useActionState<ProfileState, FormData>(
    updateProfile,
    initialState,
  );
  const [passwordState, passwordAction] = useActionState<
    PasswordState,
    FormData
  >(updatePassword, initialState);

  React.useEffect(() => {
    if (profileState.error) {
      toast.error(profileState.error);
    } else if (profileState.user) {
      toast.success("Profile updated successfully");
      profileForm.reset(profileForm.getValues());
    }
  }, [profileState, profileForm]);

  React.useEffect(() => {
    if (passwordState.error) {
      toast.error(passwordState.error);
    } else if (passwordState.success) {
      toast.success("Password updated successfully");
      passwordForm.reset();
    }
  }, [passwordState, passwordForm]);

  async function onProfileSubmit(data: ProfileFormValues) {
    startProfileTransition(async () => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (data.bio) formData.append("bio", data.bio);
      await profileAction(formData);
    });
  }

  async function onPasswordSubmit(data: PasswordFormValues) {
    startPasswordTransition(async () => {
      const formData = new FormData();
      formData.append("currentPassword", data.currentPassword);
      formData.append("newPassword", data.newPassword);
      formData.append("confirmPassword", data.confirmPassword);
      await passwordAction(formData);
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>
            Update your profile information and how others see you on the
            platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form
              onSubmit={profileForm.handleSubmit(onProfileSubmit)}
              className="space-y-4"
            >
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about yourself"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isProfilePending}>
                {isProfilePending ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Password Settings</CardTitle>
          <CardDescription>
            Update your password to keep your account secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form
              onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
              className="space-y-4"
            >
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Enter your current password"
                          {...field}
                        />
                        <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                          {showPasswords ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Enter your new password"
                          {...field}
                        />
                        <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                          {showPasswords ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPasswords ? "text" : "password"}
                          placeholder="Confirm your new password"
                          {...field}
                        />
                        <div className="text-muted-foreground absolute top-1/2 right-3 -translate-y-1/2">
                          {showPasswords ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="mb-4 flex items-center justify-between space-x-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="showPasswords"
                    checked={showPasswords}
                    onCheckedChange={(checked) =>
                      setShowPasswords(checked as boolean)
                    }
                  />
                  <label
                    htmlFor="showPasswords"
                    className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show passwords
                  </label>
                </div>
                <Button type="submit" disabled={isPasswordPending}>
                  {isPasswordPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}

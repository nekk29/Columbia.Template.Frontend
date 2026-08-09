import { useTranslation } from "react-i18next";
import { useUserInfo } from "@/features/users/hooks/usersHooks";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";

import { Label, TextField } from "react-aria-components";
import { MenuFriesLeft1, Envelope1, Telephone1 } from "@tailgrids/icons";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/tailgrids/core/input-group";

export default function Profile() {
  const { data } = useUserInfo();
  const { t: translate } = useTranslation();

  return (
    <>
      <AppCard>
        <AppCardHeader title={translate('USERS.PROFILE.TITLE')} subTitle={translate('USERS.PROFILE.SUB_TITLE')}>
        </AppCardHeader>
        <AppCardBody>
          <form>
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <TextField className="flex flex-col gap-2">
                    <Label className="sm:text-sm/4">
                      {translate('USERS.COMMON.FIELDS.FIRST_NAME')}
                    </Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <MenuFriesLeft1 className="size-4.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={data?.name}
                        className="sm:text-sm/4 ps-3"
                        disabled
                      />
                    </InputGroup>
                  </TextField>
                </div>

                <div className="sm:col-span-1">
                  <TextField className="flex flex-col gap-2">
                    <Label className="sm:text-sm/4">
                      {translate('USERS.COMMON.FIELDS.LAST_NAME')}
                    </Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <MenuFriesLeft1 className="size-4.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={data?.family_name}
                        className="sm:text-sm/4 ps-3"
                        disabled
                      />
                    </InputGroup>
                  </TextField>
                </div>

                <div className="sm:col-span-1">
                  <TextField className="flex flex-col gap-2">
                    <Label className="sm:text-sm/4">
                      {translate('USERS.COMMON.FIELDS.EMAIL')}
                    </Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Envelope1 className="size-4.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="email"
                        name="email"
                        value={data?.email}
                        className="sm:text-sm/4 ps-3"
                        disabled
                      />
                    </InputGroup>
                  </TextField>
                </div>

                <div className="sm:col-span-1">
                  <TextField className="flex flex-col gap-2">
                    <Label className="sm:text-sm/4">
                      {translate('USERS.COMMON.FIELDS.PHONE')}
                    </Label>
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <Telephone1 className="size-4.5" />
                      </InputGroupAddon>
                      <InputGroupInput
                        type="text"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={data?.phone_number}
                        className="sm:text-sm/4 ps-3"
                        disabled
                      />
                    </InputGroup>
                  </TextField>
                </div>
              </div>
            </div>
          </form>
        </AppCardBody>
      </AppCard>
    </>
  );
}

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "react-router-dom";
import { searchSettings } from "@/features/settings/api/settingsApi";
import { useSearchSettings } from "@/features/settings/hooks/settingsHooks";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";

import { Label, TextField } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { TableEmpty } from "@/components/shared/TableEmpty";
import { TableLoader } from "@/components/shared/TableLoader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { Layout6, Pencil1, Search1, Xmark } from "@tailgrids/icons";
import { exportToExcel } from "@/utils/exportToExcel";
import { useDialogs } from "@/core/dialog/hooks/useDialogs";

import {
  InputGroup,
  InputGroupInput,
} from "@/components/tailgrids/core/input-group";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@/components/tailgrids/core/table";

import type { TableColumn } from "@/models/shared/TableColumn";
import type { SearchSettingFilterModel } from "@/features/settings/models/SearchSettingFilterModel";
import type { SearchSettingModel } from "@/features/settings/models/SearchSettingModel";

import {
  defaultPage,
  type SearchParamsModel,
} from "@/models/base/query/SearchParamsModel";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

export default function SettingsList() {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.SETTINGS);
  const { openSuccessToast, openWarningToast } = useDialogs();

  const [searchParams, setSearchParams] = useState<
    SearchParamsModel<SearchSettingFilterModel>
  >({
    filter: { query: "" },
    page: defaultPage,
    sort: [],
  });

  const { data: response, isLoading } = useSearchSettings(searchParams);
  const { data } = response ?? { data: null };

  const form = useForm({ defaultValues: { query: "" } });

  const tableColumns: TableColumn<SearchSettingModel>[] = [
    {
      header: translate("SETTINGS.COMMON.FIELDS.GROUP"),
      className: "w-20",
      exportFields: new Map([
        ["group", translate("SETTINGS.COMMON.FIELDS.GROUP")],
      ]),
      render: (item) => <>{item.group}</>,
    },
    {
      header: translate("SETTINGS.COMMON.FIELDS.CODE"),
      className: "w-25",
      exportFields: new Map([
        ["code", translate("SETTINGS.COMMON.FIELDS.CODE")],
      ]),
      render: (item) => (
        <div className="font-medium text-title-50">{item.code}</div>
      ),
    },
    {
      header: translate("SETTINGS.COMMON.FIELDS.DESCRIPTION"),
      className: "w-35",
      exportFields: new Map([
        ["description", translate("SETTINGS.COMMON.FIELDS.DESCRIPTION")],
      ]),
      render: (item) => <>{item.description}</>,
    },
    {
      header: translate("SETTINGS.COMMON.FIELDS.VALUE"),
      className: "w-35",
      exportFields: new Map([
        ["value", translate("SETTINGS.COMMON.FIELDS.VALUE")],
      ]),
      render: (item) => (
        <div className="truncate max-w-80" title={item.value}>
          {item.value}
        </div>
      ),
    },
    {
      header: translate('COMMON.FIELDS.STATUS'),
      className: "w-15",
      exportFields: new Map([
        ["isActive", translate('COMMON.FIELDS.STATUS')],
      ]),
      render: (item: SearchSettingModel) => (
        <StatusBadge isActive={item.isActive} />
      )
    },
    {
      header: translate("COMMON.FIELDS.ACTIONS"),
      className: "w-10",
      render: (item) => (
        <HasPermissions permissions={[PERMISSIONS.EDIT]}>
          <Button
            size="xs"
            variant="primary"
            iconOnly
            onClick={() => onEdit(item)}
          >
            <Pencil1 />
          </Button>
        </HasPermissions>
      ),
    },
  ];

  const onSearch = () =>
    setSearchParams({
      ...searchParams,
      filter: form.state.values,
      page: { page: 1, pageSize: searchParams.page.pageSize },
    });

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch();
  };

  const onReset = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    form.reset();
    setSearchParams({
      ...searchParams,
      filter: { query: "" },
      page: { page: 1, pageSize: searchParams.page.pageSize },
    });
  };

  const onPageChange = (page: number, pageSize: number) =>
    setSearchParams({ ...searchParams, page: { page, pageSize } });

  const onEdit = (item: SearchSettingModel) => {
    navigate(
      `/settings/edit/${encodeURIComponent(item.group)}/${encodeURIComponent(item.code)}`,
    );
  };

  const onExport = () => {
    if ((data?.items ?? []).length === 0) {
      openWarningToast(translate("COMMON.MESSAGES.EXPORT.NO_RECORDS"));
      return;
    }

    searchSettings({
      ...searchParams,
      page: { page: 1, pageSize: 1000 },
    }).then((result) => {
      exportToExcel({
        items: result.data?.items ?? [],
        columns: tableColumns,
        fileName: "Settings",
        sheetName: "Settings",
        translate,
        onSuccess: () =>
          openSuccessToast(translate("COMMON.MESSAGES.EXPORT.SUCCESS")),
      });
    });
  };

  return (
    <>
      <AppCard className="mb-6">
        <AppCardHeader
          title={translate("SETTINGS.SEARCH.TITLE")}
          subTitle={translate("SETTINGS.SEARCH.SUB_TITLE")}
        >
          <HasPermissions permissions={[PERMISSIONS.EXPORT]}>
            <Button size="xs" variant="success" onClick={onExport}>
              <Layout6 />
              {translate("COMMON.ACTIONS.EXPORT")}
            </Button>
          </HasPermissions>
        </AppCardHeader>
        <AppCardBody>
          <form onSubmit={onSubmit} onReset={onReset}>
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                <div className="sm:col-span-9">
                  <form.Field
                    name="query"
                    children={(field) => (
                      <TextField className="flex items-center gap-4">
                        <Label className="sm:text-sm/4">
                          {translate("COMMON.FIELDS.FILTER")}
                        </Label>
                        <InputGroup>
                          <InputGroupInput
                            type="text"
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            className="sm:text-sm/4"
                            placeholder={translate(
                              "COMMON.FIELDS.FILTER_PLACEHOLDER",
                            )}
                            onChange={(event) =>
                              field.handleChange(event.target.value)
                            }
                          />
                        </InputGroup>
                      </TextField>
                    )}
                  />
                </div>
                <div className="flex flex-wrap justify-end gap-2 sm:col-span-3">
                  <HasPermissions permissions={[PERMISSIONS.SEARCH]}>
                    <Button type="submit" size="xs" variant="primary">
                      <Search1 />
                      {translate("COMMON.ACTIONS.SEARCH")}
                    </Button>
                  </HasPermissions>
                  <Button
                    type="reset"
                    size="xs"
                    variant="ghost"
                    className="border border-base-500"
                  >
                    <Xmark />
                    {translate("COMMON.ACTIONS.CLEAR")}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </AppCardBody>
      </AppCard>
      <TableRoot className="mb-2">
        <TableHeader>
          <TableRow className="bg-background-soft-50 border-none">
            {tableColumns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading && <TableLoader colSpan={5} />}
          {!isLoading && (data?.items ?? []).length === 0 && (
            <TableEmpty colSpan={5} />
          )}
          {!isLoading &&
            data?.items.map((item) => (
              <TableRow
                key={`${item.group}:${item.code}`}
                className="text-sm border-b border-(--border-color-base-50) last:border-none"
              >
                {tableColumns.map((column, index) => (
                  <TableCell key={index} className={column.className}>
                    {column.render(item, 0)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </TableRoot>
      {data && (
        <TablePagination
          total={data.total}
          page={data.page}
          pageSize={data.pageSize}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}

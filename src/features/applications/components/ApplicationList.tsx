import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from '@tanstack/react-form';
import { useNavigate } from "react-router-dom";
import { searchApplications } from "@/features/applications/api/applicationsApi";
import { useDeleteApplication, useSearchApplications } from "@/features/applications/hooks/applicationsHooks";

import { AppCard } from "@/components/layout/content/AppCard";
import { AppCardBody } from "@/components/layout/content/AppCardBody";
import { AppCardHeader } from "@/components/layout/content/AppCardHeader";

import { Label, TextField } from "react-aria-components";
import { Button } from "@/components/tailgrids/core/button";
import { TableEmpty } from "@/components/shared/TableEmpty";
import { TableLoader } from "@/components/shared/TableLoader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";
import { Plus, Layout6, Search1, Xmark, Pencil1, Trash1 } from "@tailgrids/icons";
import { InputGroup, InputGroupInput } from "@/components/tailgrids/core/input-group";

import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow
} from "@/components/tailgrids/core/table";

import type { TableColumn } from "@/models/shared/TableColumn";
import type { ResponseBaseDto } from "@/models/base/api/ResponseBaseDto";
import type { SearchApplicationModel } from "@/features/applications/models/SearchApplicationModel";
import type { SearchApplicationFilterModel } from "@/features/applications/models/SearchApplicationFilterModel";
import { defaultPage, type SearchParamsModel } from "@/models/base/query/SearchParamsModel";

import { MODULES } from "@/core/auth/permissions/modules";
import { HasPermissions } from "@/core/auth/components/HasPermissions";
import { usePermissionsModule } from "@/core/auth/hooks/usePermissions";

import { exportToExcel } from "@/utils/exportToExcel";
import { useDialogs } from "@/core/dialog/hooks/useDialogs";

export default function ApplicationList() {
  const navigate = useNavigate();
  const { t: translate } = useTranslation();
  const { PERMISSIONS } = usePermissionsModule(MODULES.APPLICATIONS);

  const {
    openToasts,
    openErrorToast,
    openSuccessToast,
    openWarningToast,
    openConfirmationDialog
  } = useDialogs();

  const tableColumns: TableColumn<SearchApplicationModel>[] = [
    {
      header: translate('APPLICATIONS.COMMON.FIELDS.CODE'),
      className: "w-25",
      exportFields: new Map([
        ["code", translate('APPLICATIONS.COMMON.FIELDS.CODE')],
      ]),
      render: (item: SearchApplicationModel) => (
        <div className="font-medium text-title-50 whitespace-nowrap">{item.code}</div>
      )
    },
    {
      header: translate('APPLICATIONS.COMMON.FIELDS.NAME'),
      className: "w-35",
      exportFields: new Map([
        ["name", translate('APPLICATIONS.COMMON.FIELDS.NAME')],
      ]),
      render: (item: SearchApplicationModel) => (
        <>{item.name}</>
      )
    },
    {
      header: translate('APPLICATIONS.COMMON.FIELDS.LOGO_URI'),
      className: "w-35",
      exportFields: new Map([
        ["logoUri", translate('APPLICATIONS.COMMON.FIELDS.LOGO_URI')],
      ]),
      render: (item: SearchApplicationModel) => (
        <div className="truncate max-w-60" title={item.logoUri}>{item.logoUri}</div>
      )
    },
    {
      header: translate('COMMON.FIELDS.STATUS'),
      className: "w-15",
      exportFields: new Map([
        ["isActive", translate('COMMON.FIELDS.STATUS')],
      ]),
      render: (item: SearchApplicationModel) => (
        <StatusBadge isActive={item.isActive} />
      )
    },
    {
      header: translate('COMMON.FIELDS.ACTIONS'),
      className: "w-10",
      render: (item: SearchApplicationModel) => (
        <div className="flex flex-wrap gap-2">
          <HasPermissions permissions={[PERMISSIONS.EDIT]}>
            <Button size="xs" variant="primary" iconOnly onClick={() => onEdit(item)}>
              <Pencil1 />
            </Button>
          </HasPermissions>
          <HasPermissions permissions={[PERMISSIONS.DELETE]}>
            <Button size="xs" variant="danger" iconOnly disabled={!item.isActive} onClick={() => onDelete(item)}>
              <Trash1 />
            </Button>
          </HasPermissions>
        </div>
      )
    }
  ];

  const defaultSearchParams: SearchParamsModel<SearchApplicationFilterModel> = {
    filter: { query: '' },
    page: defaultPage,
    sort: []
  };

  const [searchParams, setSearchParams] = useState<SearchParamsModel<SearchApplicationFilterModel>>(defaultSearchParams);

  const { data: dataResponse, isLoading, refetch } = useSearchApplications(searchParams);
  const { data } = dataResponse ?? { data: null };

  const { mutate: deleteRecord } = useDeleteApplication({
    onSuccess: (response: ResponseBaseDto) => {
      openToasts(response);
      if (response.isValid) { refetch(); }
    },
    onError: (error) => {
      openErrorToast("Operation failed");
      console.error(error);
    }
  });

  const form = useForm({
    defaultValues: {
      query: ''
    },
  });

  const onSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    onSearch();
  };

  const onReset = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    form.reset();
    onSearch();
  };

  const onSearch = (): void => {
    const { query } = form.state.values;

    setSearchParams({
      ...searchParams,
      filter: { query },
      page: { page: 1, pageSize: searchParams.page.pageSize }
    });
  }

  const onPageChange = (page: number, pageSize: number) => {
    setSearchParams({
      ...searchParams,
      page: { page, pageSize }
    });
  };

  const onExport = (): void => {
    const exportItems = data?.items ?? [];
    if (exportItems.length === 0) {
      openWarningToast(translate("COMMON.MESSAGES.EXPORT.NO_RECORDS"));
      return;
    }

    const exportParams = {
      ...searchParams,
      page: { page: 1, pageSize: 1000 }
    }

    searchApplications(exportParams).then((response) => {
      exportToExcel({
        items: response?.data?.items ?? [],
        columns: tableColumns,
        fileName: 'Applications',
        sheetName: 'Applications',
        translate: translate,
        onSuccess: () => {
          openSuccessToast(translate("COMMON.MESSAGES.EXPORT.SUCCESS"));
        }
      });
    });
  }

  const onNew = (): void => {
    navigate(`/applications/new`);
  }

  const onEdit = (item: SearchApplicationModel): void => {
    navigate(`/applications/edit/${item.id}`);
  }

  const onDelete = (item: SearchApplicationModel): void => {
    openConfirmationDialog({
      data: item.id,
      title: translate('COMMON.MESSAGES.DELETE.TITLE'),
      description: translate('COMMON.MESSAGES.DELETE.QUESTION'),
      onYes: (id: string) => { deleteRecord(id); }
    });
  }

  return (
    <>
      <AppCard className="mb-6">
        <AppCardHeader title={translate('APPLICATIONS.SEARCH.TITLE')} subTitle={translate('APPLICATIONS.SEARCH.SUB_TITLE')}>
          <div className="flex flex-wrap justify-end gap-2">
            <HasPermissions permissions={[PERMISSIONS.CREATE]}>
              <Button size="xs" variant="primary" onClick={onNew}>
                <Plus />
                {translate('COMMON.ACTIONS.NEW')}
              </Button>
            </HasPermissions>
            <HasPermissions permissions={[PERMISSIONS.EXPORT]}>
              <Button size="xs" variant="success" onClick={onExport}>
                <Layout6 />
                {translate('COMMON.ACTIONS.EXPORT')}
              </Button>
            </HasPermissions>
          </div>
        </AppCardHeader>
        <AppCardBody>
          <form onSubmit={onSubmit} onReset={onReset}>
            <div className="space-y-12">
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-12">
                <div className="sm:col-span-9">
                  <form.Field name="query" children={(field) => (
                    <TextField className="flex items-center gap-4">
                      <Label className="sm:text-sm/4">
                        {translate('COMMON.FIELDS.FILTER')}
                      </Label>
                      <InputGroup>
                        <InputGroupInput
                          type="text"
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          className="sm:text-sm/4"
                          placeholder={translate('COMMON.FIELDS.FILTER_PLACEHOLDER')}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                        />
                      </InputGroup>
                    </TextField>)
                  }>
                  </form.Field>
                </div>
                <div className="sm:col-span-3">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button type="submit" size="xs" variant="primary">
                      <Search1 />
                      {translate('COMMON.ACTIONS.SEARCH')}
                    </Button>
                    <Button type="reset" size="xs" variant="ghost" className="border border-base-500">
                      <Xmark />
                      {translate('COMMON.ACTIONS.CLEAR')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </AppCardBody>
      </AppCard>

      <TableRoot className="mb-2">
        <TableHeader>
          <TableRow className="bg-background-soft-50 border-none">
            {tableColumns.map((tc, index) => {
              return (
                <TableHead key={`TableHead${index}`} className={tc.className} colSpan={tc.colSpan ?? 1}>
                  {tc.header}
                </TableHead>);
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading &&
            <TableLoader colSpan={5} />
          }
          {!isLoading && (data?.items ?? []).length === 0 &&
            <TableEmpty colSpan={5} />
          }
          {!isLoading && (data?.items ?? []).map((item) => (
            <TableRow key={item.id} className="text-sm border-b border-(--border-color-base-50) last:border-none" >
              {tableColumns.map((tc, tcIdx) => {
                return (
                  <TableCell key={`TableCell${tcIdx}`} className={tc.className} colSpan={tc.colSpan ?? 1}>
                    {tc.render(item, 0)}
                  </TableCell>);
              })}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>

      {data && <TablePagination
        total={data.total}
        page={data.page}
        pageSize={data.pageSize}
        onPageChange={onPageChange} />}
    </>
  );
}

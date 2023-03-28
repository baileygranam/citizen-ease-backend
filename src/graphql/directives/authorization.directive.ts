import { ForbiddenError } from 'apollo-server-express';
import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';
import { User } from '@models';

const isAuthorized = async (
  fieldPermissions: string[],
  typePermissions: string[],
  { userId, businessId }: { userId: string; businessId: string }
) => {
  const user = await User.getUserById(businessId, userId, {
    include: { role: { include: { permissions: true } } }
  });

  const userPermissions = user.role.permissions.map(
    (permission) => permission.scope
  );

  for (const permission of fieldPermissions) {
    if (userPermissions.includes(permission)) {
      return true;
    }
  }

  if (fieldPermissions.length === 0) {
    for (const typePermission of typePermissions) {
      if (userPermissions.includes(typePermission)) {
        return true;
      }
    }
  }

  return false;
};

const gatherTypePermissions = (schema: GraphQLSchema) => {
  const typePermissionMapping = new Map();

  mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (typeConfig) => {
      const typeAuthDirective = getDirective(
        schema,
        typeConfig,
        'authorization'
      )?.[0];
      const typeLevelPermissions = typeAuthDirective?.permissions ?? [];

      typePermissionMapping.set(typeConfig.name, typeLevelPermissions);

      return typeConfig;
    }
  });

  return typePermissionMapping;
};

export const getAuthorizedSchema = (schema: GraphQLSchema) => {
  const typePermissionMapping = gatherTypePermissions(schema);

  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const fieldAuthDirective = getDirective(
        schema,
        fieldConfig,
        'authorization'
      )?.[0];
      const fieldPermissions = fieldAuthDirective?.permissions ?? [];
      const typePermissions = typePermissionMapping.get(typeName) ?? [];

      if (fieldPermissions.length > 0 || typePermissions.length > 0) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;

        fieldConfig.resolve = async (source, args, context, info) => {
          if (
            !(await isAuthorized(fieldPermissions, typePermissions, context))
          ) {
            throw new ForbiddenError('Unauthorized Request');
          }

          return originalResolver(source, args, context, info);
        };
      }
      return fieldConfig;
    }
  });
  return authorizedSchema;
};

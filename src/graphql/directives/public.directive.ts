import { mapSchema, getDirective, MapperKind } from '@graphql-tools/utils';
import { GraphQLSchema, defaultFieldResolver } from 'graphql';

export const getAuthenticatedSchema = (schema: GraphQLSchema) => {
  const authorizedSchema = mapSchema(schema, {
    [MapperKind.OBJECT_TYPE]: (type) => {
      const typePublicDirective = getDirective(schema, type, 'public')?.[0];

      if (typePublicDirective) {
        return undefined;
      }

      return type;
    },
    [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
      const objectType = schema.getType(typeName);
      const typePublicDirective = getDirective(
        schema,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        objectType!,
        'public'
      )?.[0];
      const fieldPublicDirective = getDirective(
        schema,
        fieldConfig,
        'public'
      )?.[0];

      if (!fieldPublicDirective && !typePublicDirective) {
        const originalResolver = fieldConfig.resolve ?? defaultFieldResolver;
        fieldConfig.resolve = (source, args, context, info) => {
          const { userId } = context;
          if (!userId) {
            throw new Error('Unauthorized Request');
          }
          return originalResolver(source, args, context, info);
        };
      }
      return fieldConfig;
    }
  });

  return authorizedSchema;
};

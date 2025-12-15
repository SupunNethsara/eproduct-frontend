import React from "react";

const ValidationResults = ({ validationResult }) => {
    if (
        !validationResult ||
        (validationResult.status && validationResult.status !== "failed")
    ) {
        return null;
    }

    const formatError = (error) => {
        if (typeof error === "string") return error;
        if (error.message) return error.message;
        if (error.errors && Array.isArray(error.errors)) {
            return error.errors.join(", ");
        }
        return JSON.stringify(error);
    };

    const getErrors = (errors) => {
        if (!errors) return [];
        if (Array.isArray(errors)) {
            return errors.map(formatError);
        }
        if (errors.errors && Array.isArray(errors.errors)) {
            return errors.errors.map(formatError);
        }
        return [formatError(errors)];
    };

    const hasDetailsErrors =
        validationResult.details_errors &&
        (Array.isArray(validationResult.details_errors)
            ? validationResult.details_errors.length > 0
            : Object.keys(validationResult.details_errors).length > 0);

    const hasPricingErrors =
        validationResult.pricing_errors &&
        (Array.isArray(validationResult.pricing_errors)
            ? validationResult.pricing_errors.length > 0
            : Object.keys(validationResult.pricing_errors).length > 0);

    if (!hasDetailsErrors && !hasPricingErrors) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="text-red-800 font-medium">Validation Error:</h4>
                <p className="text-red-600 text-sm">
                    An unknown error occurred during validation.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="text-red-800 font-medium mb-2">
                Validation Errors Found:
            </h4>
            {hasDetailsErrors && (
                <div className="mb-3">
                    <h5 className="text-red-700 text-sm font-medium">
                        Details File Errors:
                    </h5>
                    <ul className="text-red-600 text-sm list-disc list-inside">
                        {getErrors(validationResult.details_errors).map(
                            (error, index) => (
                                <li key={`details-${index}`}>{error}</li>
                            ),
                        )}
                    </ul>
                </div>
            )}
            {hasPricingErrors && (
                <div>
                    <h5 className="text-red-700 text-sm font-medium">
                        Pricing File Errors:
                    </h5>
                    <ul className="text-red-600 text-sm list-disc list-inside">
                        {getErrors(validationResult.pricing_errors).map(
                            (error, index) => (
                                <li key={`pricing-${index}`}>{error}</li>
                            ),
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default ValidationResults;

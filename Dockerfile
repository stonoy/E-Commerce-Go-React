FROM --platform=linux/amd64 debian:stable-slim

# Update package repositories and install necessary packages
RUN apt-get update && apt-get install -y ca-certificates

# Copy the ecom1 executable to /usr/bin/
ADD ecom1 /usr/bin/ecom1

# Copy the .env file to /usr/bin/.env
# COPY .env /usr/bin/.env

# Set the working directory to /usr/bin/
# WORKDIR /usr/bin/

# Set the entry point command
CMD ["ecom1"]

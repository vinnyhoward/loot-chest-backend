# Use an official Ubuntu image as a parent image
FROM ubuntu

# Set the working directory in the container
WORKDIR /usr/src/app

# Install necessary dependencies including curl and unzip
RUN apt-get update && \
    apt-get install -y curl unzip && \
    rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:$PATH"

# Copy the current directory contents into the container at /usr/src/app
COPY . .

COPY prisma ./prisma

# Install any needed packages specified in package.json
RUN bun install

# Make port available to the world outside this container
EXPOSE 3000

# Run when the container launches
CMD ["bun", "run", "start"]
